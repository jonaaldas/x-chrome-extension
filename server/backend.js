import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import {TwitterApi} from 'twitter-api-v2';
import {createClient} from '@supabase/supabase-js';
import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';

// Initialize Koa app and Router
const app = new Koa();
const router = new Router();

// Configure Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_KEY_ANON = process.env.SUPABASE_KEY_ANON;
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false
	}
});
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY_ANON);

// middleware

async function verifyJWT(ctx, next) {
	const token = ctx.headers.authorization?.split('Bearer ')[1];

	if (!token) {
		ctx.status = 401;
		ctx.body = {error: 'No token provided'};
		return;
	}

	try {
		// Verify token
		const decoded = jsonwebtoken.verify(token, SUPABASE_JWT_SECRET);
		// Assuming the user ID is in the 'sub' claim
		ctx.state.user = jsonwebtoken.verify(token, SUPABASE_JWT_SECRET);
		ctx.state.userId = decoded.sub;
		await next();
	} catch (error) {
		ctx.status = 401;
		ctx.body = {error: 'Invalid token'};
	}
}

app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

router.post('/api/tweet', verifyJWT, async ctx => {
	const {text, token} = ctx.request.body;

	if (!text || !token) {
		ctx.body = {success: false, message: 'Missing text or token'};
		return;
	}

	const apiKeys = await getApiKeysFromDatabase(token);

	if (!apiKeys) {
		ctx.body = {success: false, message: 'Error getting api keys'};
		return;
	}

	const twitterClient = new TwitterApi({
		appKey: apiKeys.app_key,
		appSecret: apiKeys.app_secret,
		accessToken: apiKeys.access_token,
		accessSecret: apiKeys.access_secret
	}).readWrite;

	try {
		const response = await twitterClient.v2.tweet(text);
		console.log('Tweet response:', response);
		ctx.body = {success: true, message: 'Tweet sent'};
	} catch (e) {
		console.error('Error sending tweet:', e);
		ctx.body = {success: false, message: e?.data?.detail || 'Error sending tweet'};
	}
});

router.get('/api/test', verifyJWT, async ctx => {
	console.log('I am running');
	ctx.body = {success: true};
});

// save settings
router.post('/api/save', verifyJWT, async ctx => {
	const obj = ctx.request.body;
	const userId = await getUserId(ctx);

	const res = await testApiKeys(obj.apiKeys);

	const dataToSave = {...obj.apiKeys, user_id: userId};

	if (res.success) {
		const {data, error} = await supabase.from('user_api_keys').insert([dataToSave]).select();

		if (data) {
			ctx.body = {success: true, message: 'Saved successfully'};
		}
		if (error) {
			ctx.body = {success: false, message: error?.message || 'Error saving settings1'};
		}
	} else {
		ctx.body = {success: false, message: 'Incorrect API keys'};
	}
});

// gets api keys from DB
router.get('/api/keys', verifyJWT, async ctx => {
	const userId = await getUserId(ctx);

	if (userId === undefined) {
		ctx.body = {success: false, message: 'Error getting user'};
		return;
	}

	try {
		const {data, error} = await supabase.from('user_api_keys').select('*').eq('user_id', userId);

		if (data.length === 0) {
			ctx.body = {success: false, message: 'Error getting api keys'};
			return;
		}

		ctx.body = {success: true, data: data};
	} catch (error) {
		console.log(error);
		ctx.body = {success: false, message: 'Error getting api keys'};
	}
});

// get username from twitter
router.get('/api/username', verifyJWT, async ctx => {
	const token = ctx.headers.authorization?.split('Bearer ')[1];
	const keys = await getApiKeysFromDatabase(token);

	if (!keys) {
		ctx.body = {success: false, message: 'Error getting api keys'};
		return;
	}
	const res = await testApiKeys(keys);

	if (!res.success) {
		ctx.body = {success: false, message: 'Error getting username'};
		return;
	}

	ctx.body = res;
});

async function getApiKeysFromDatabase(token) {
	const {data: user, error} = await supabase.auth.getUser(token);

	if (user.user === null) {
		return;
	}
	const id = user.user.id;

	const {data, error: getApiKeysError} = await supabase.from('user_api_keys').select('*').eq('user_id', id);
	if (data.length === 0) {
		return false;
	}
	const {app_key, app_secret, access_token, access_secret} = data[0];
	return {app_key, app_secret, access_token, access_secret};
}

// test api keys
async function testApiKeys(keys) {
	if (!keys) {
		return {success: false, message: 'Error getting api keys132'};
	}

	const twitterClient = new TwitterApi({
		appKey: keys.app_key,
		appSecret: keys.app_secret,
		accessToken: keys.access_token,
		accessSecret: keys.access_secret
	}).readWrite;

	try {
		const response = await twitterClient.v2.me();

		if (response?.data) {
			return {success: true, message: 'Saved successfully', data: response};
		}
	} catch (e) {
		console.error('Error saving settings12:', e);
		return {success: false, message: e?.data?.detail || 'Error saving settings'};
	}
}

async function getUserId(ctx) {
	const token = ctx.headers.authorization?.split('Bearer ')[1];
	const {
		data: {user}
	} = await supabase.auth.getUser(token);
	return user.id;
}

const port = process.env.PORT || 3050;

app.listen(port, () => {
	console.log(`Running on port ${port}`);
});
