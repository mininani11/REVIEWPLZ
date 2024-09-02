document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const service = document.getElementById('service').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const videoUrl = document.getElementById('videoUrl').value;
    const tonAddress = document.getElementById('tonAddress').value;

    const yourTonWalletAddress = "UQCqS0fDMpyXXscBHtjjV9auzVPTHiD6_HXHmibJeMP1RPnY"; // Replace with your actual TON wallet address

    // Calculate the total price based on the selected service and quantity
    let pricePerUnit = (service === 'views') ? 0.001 : 0.01;
    let totalPrice = quantity * pricePerUnit;

    // Generate the TON payment link
    const tonPaymentLink = generateTonkeeperLink(yourTonWalletAddress, totalPrice);

    // Redirect user to Tonkeeper for payment
    window.location.href = tonPaymentLink;

    // Simulate payment confirmation (Replace this with backend verification logic)
    checkPaymentStatus(tonAddress, yourTonWalletAddress, totalPrice, service, quantity, videoUrl);
});

// Update the total price dynamically when quantity or service is changed
function updatePricing() {
    const service = document.getElementById('service').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    let pricePerUnit = (service === 'views') ? 0.001 : 0.01;
    let totalPrice = quantity * pricePerUnit;

    // Update the total price field
    document.getElementById('totalPrice').value = totalPrice.toFixed(6) + " TON";
}

// Generate a Tonkeeper payment link
function generateTonkeeperLink(recipientAddress, amountTON) {
    const tonkeeperUrl = `https://app.tonkeeper.com/transfer/${recipientAddress}?amount=${amountTON * 1e9}`; 
    return tonkeeperUrl;
}

// Placeholder function to simulate backend payment confirmation
function checkPaymentStatus(userTonAddress, recipientAddress, amount, service, quantity, videoUrl) {
    fetch('https://reviewplz.vercel.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userWallet: userTonAddress,
            recipientWallet: recipientAddress,
            amountTON: amount
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('confirmationMessage').textContent = `Payment confirmed! You will receive ${quantity} ${service} for your video: ${videoUrl}`;
        } else {
            document.getElementById('confirmationMessage').textContent = `Payment not confirmed. Please try again.`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('confirmationMessage').textContent = 'Error occurred while verifying payment.';
    });
}
