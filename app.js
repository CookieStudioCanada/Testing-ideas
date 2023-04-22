const form = document.querySelector('form');
const integrations = document.querySelectorAll('input[type="checkbox"]');
const submitButton = document.querySelector('button[type="submit"]');

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  
    // Form data
    const websitePurpose = document.getElementById("websitePurpose").value;
    const targetAudience = document.getElementById("targetAudience").value;
    const keyFeatures = document.getElementById("keyFeatures").value;
    const websiteStyle = document.getElementById("websiteStyle").value;
    const competitorWebsites = document.getElementById("competitorWebsites").value;
  
    // Integrations data
    const stripe = document.getElementById("stripeCheckbox").checked;
    const calendly = document.getElementById("calendlyCheckbox").checked;
    const mailchimp = document.getElementById("mailchimpCheckbox").checked;
  
    const formData = {
      websitePurpose,
      targetAudience,
      keyFeatures,
      websiteStyle,
      competitorWebsites,
      stripe,
      calendly,
      mailchimp
    };
  
    // Save form data to local storage
    localStorage.setItem("formData", JSON.stringify(formData));
  
    // Close the modal
    const modalElement = document.getElementById("fullscreenModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  
    // Show the form data in a div on the homepage
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = JSON.stringify(formData, null, 2);
  });
  