const form = document.querySelector('form');
const integrations = document.querySelectorAll('input[type="checkbox"]');
const submitButton = document.querySelector('button[type="submit"]');

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  
  // Get form values
  const websitePurpose = document.querySelector('#websitePurpose').value;
  const targetAudience = document.querySelector('#targetAudience').value;
  const keyFeatures = document.querySelector('#keyFeatures').value;
  const websiteStyle = document.querySelector('#websiteStyle').value;
  const competitorWebsites = document.querySelector('#competitorWebsites').value;
  
  // Get integration choices
  const integrationValues = [];
  integrations.forEach(integration => {
    if (integration.checked) {
      integrationValues.push(integration.value);
    }
  });
  
  // Create array of objects
  const data = [
    {
      section: 'Form',
      values: {
        websitePurpose,
        targetAudience,
        keyFeatures,
        websiteStyle,
        competitorWebsites
      }
    },
    {
      section: 'Integrations',
      values: {
        integrations: integrationValues
      }
    }
  ];
  
  console.log(data); // Output the array of objects to console
});