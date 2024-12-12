const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { productId } = JSON.parse(event.body);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: getProductName(productId),
                            description: getProductDescription(productId)
                        },
                        unit_amount: getProductPrice(productId),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.URL}/success.html`,
            cancel_url: `${process.env.URL}`,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create checkout session' })
        };
    }
};

function getProductName(productId) {
    const products = {
        'python_agent': 'Supreme Quantum Python Entity',
        'java_agent': 'Supreme Quantum Java Entity',
        'cpp_agent': 'Supreme Quantum C++ Entity'
    };
    return products[productId] || 'Unknown Product';
}

function getProductDescription(productId) {
    const descriptions = {
        'python_agent': 'A revolutionary Python-powered entity designed for developers, scientists, and innovators.',
        'java_agent': 'A next-generation Java entity tailored for developers and enterprises.',
        'cpp_agent': 'An unparalleled C++ entity for engineers and developers.'
    };
    return descriptions[productId] || '';
}

function getProductPrice(productId) {
    const prices = {
        'python_agent': 59999, // $599.99
        'java_agent': 69999,   // $699.99
        'cpp_agent': 74999     // $749.99
    };
    return prices[productId] || 999;
} 