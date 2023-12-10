const url = 'http://localhost:3050';

document.querySelector('.btn').addEventListener('click', async () => {
    let pro = await fetchProducts();
    console.log('🚀 ~ file: stripe.html:18 ~ document.querySelector ~ pro:', pro);
    if (pro.length) {
        checkout(pro[0].price_id);
    }
});
async function fetchProducts() {
    const response = await fetch(`${url}/api/plans`);
    const res = await response.json();
    return res;
}

async function checkout(productId) {
    const response = await fetch(`${url}/api/checkout/${productId}`);
    const res = await response.json();
    const id = res.sessionId;

    const stripe = await stripe.loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
    await stripe.redirectToCheckout({
        sessionId: id,
    });
}
