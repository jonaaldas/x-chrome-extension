import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import {TwitterApi} from 'twitter-api-v2';
import {createClient} from '@supabase/supabase-js';
import 'dotenv/config';
import getRawBody from 'raw-body';

// Initialize Koa app and Router
const app = new Koa();
const router = new Router();

// Configure Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_KEY_ANON = process.env.SUPABASE_KEY_ANON;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false
	}
});
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY_ANON);

// app.use(cors({origin: 'chrome-extension://mbfkbhjlgaagajniodnamomnpifkleef', credentials: true}));
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next) => {
	if (ctx.path === '/api/webhooks') {
		await next();
	} else {
		return bodyParser()(ctx, next);
	}
});

router.post('/api/register', async ctx => {
	const {email, password} = ctx.request.body;
	if (!email || !password) {
		ctx.body = {success: false, message: 'Missing email or password'};
		return;
	}

	try {
		const {data, error} = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: true
		});
		ctx.body = {success: true};
	} catch (error) {
		console.log(error);
		ctx.body = {error};
	}
});

router.post('/api/login', async ctx => {
	const {email, password} = ctx.request.body;
	if (!email || !password) {
		ctx.body = {success: false, message: 'Missing email or password'};
		return;
	}

	try {
		const {data, error} = await supabase.auth.signInWithPassword({
			email,
			password
		});
		console.log('🚀 ~ file: backend.js:59 ~ router.post ~ error:', error);
		console.log('🚀 ~ file: backend.js:62 ~ router.post ~ data:', data);
		if (error === null) {
			ctx.body = {success: true, data};
		} else {
			ctx.body = {error};
		}
	} catch (error) {
		console.log(error);
		ctx.body = {error};
	}
});

// logout

router.post('/api/logout', async ctx => {
	try {
		const res = await supabase.auth.signOut();
		ctx.body = {message: 'Logged out'};
	} catch (error) {
		console.log(error);
		ctx.body = {error};
	}
});

router.post('/api/tweet', async ctx => {
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

// fetch user
router.put('/api/user', async ctx => {
	const {token} = ctx.request.body;
	try {
		const {data: user} = await supabase.auth.getUser(token);
		const id = user.user.id;
		ctx.body = user;
	} catch (error) {
		console.log(error);
		ctx.body = {error};
	}
});

// save settings

router.post('/api/save/settings', async ctx => {
	const obj = ctx.request.body;

	const res = await testApiKeys(obj.apiKeys);

	const dataToSave = {...obj.apiKeys, user_id: obj.userId};

	if (res.success) {
		const {data, error} = await supabase.from('user_api_keys').insert([dataToSave]).select();

		if (data) {
			ctx.body = {success: true, message: 'Saved successfully'};
		}
		if (error) {
			ctx.body = {success: false, message: error?.message || 'Error saving settings1'};
		}
	} else {
		ctx.body = {success: false, message: res.message || 'Error saving settings12'};
	}
});

// gets api keys from DB
router.put('/api/keys', async ctx => {
	const {userId} = ctx.request.body;
	console.log('🚀 ~ file: backend.js:157 ~ router.put ~ userID:', userId);

	if (userId === undefined) {
		ctx.body = {success: false, message: 'Error getting user'};
		return;
	}

	try {
		const {data, error} = await supabase.from('user_api_keys').select('*').eq('user_id', userId);

		console.log('🚀 ~ file: backend.js:165 ~ router.put ~ error:', error);

		if (data.length === 0) {
			ctx.body = {success: false, message: 'Error getting api keys'};
			return;
		}

		ctx.body = data;
	} catch (error) {
		console.log(error);
		ctx.body = {success: false, message: 'Error getting api keys'};
	}
});

async function getApiKeysFromDatabase(token) {
	const {data: user, error: getUserError} = await supabase.auth.getUser(token);
	console.log('🚀 ~ file: backend.js:178 ~ getApiKeysFromDatabase ~ user:', user);

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
		console.log('🚀 ~ file: backend.js:214 ~ testApiKeys ~ response:', response);

		if (response?.data) {
			return {success: true, message: 'Saved successfully'};
		}
	} catch (e) {
		console.error('Error saving settings12:', e);
		return {success: false, message: e?.data?.detail || 'Error saving settings'};
	}
}

// stripe integration

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27'
});

router.get('/api/plans', async ctx => {
	const prices = await stripe.prices.list({
		limit: 3
	});

	// retrieve product for the name
	let plan = [];
	if (prices) {
		for (const price of prices.data) {
			const product = await stripe.products.retrieve(price.product);
			plan.push({
				price_id: price.id,
				currency: price.currency,
				recurring: price.recurring.interval,
				product_name: product.name,
				product_description: product.description,
				unit_amount: price.unit_amount / 100
			});
		}
	}
	ctx.body = plan;
});

// create checkout session
router.get('/api/checkout/:id', async ctx => {
	const {id} = ctx.params;

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price: id,
				quantity: 1
			}
		],
		mode: 'subscription',
		success_url: 'http://127.0.0.1:5174',
		cancel_url: 'http://127.0.0.1:5174'
	});

	ctx.body = {sessionId: session.id};
});

router.post('/api/webhooks', async ctx => {
	console.log('I am running');
	console.log(ctx.request);
	const signature = ctx.headers['stripe-signature'];
	const singingSecret = process.env.STRIPE_SIGNING_SECRET;
	// we need to construct a buffer, we are using grok to get the webhook from stripe

	let event;
	try {
		const buf = await getRawBody(ctx.req);
		event = stripe.webhooks.constructEvent(buf, signature, singingSecret);
	} catch (error) {
		console.log('🚀 ~ file: backend.js:288 ~ error:', error);
	}

	console.log('🚀 ~ file: backend.js:287 ~ event:', event);

	ctx.body = {success: true};
});

const port = process.env.PORT || 3050;

app.listen(port, () => {
	console.log(`Running on port ${port}`);
});
