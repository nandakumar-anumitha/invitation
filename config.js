// Edit these details before publishing. No build step is required.
window.WEDDING_CONFIG = {
  locationUrl: 'https://share.google/yBJDRBLYke2OfDeVp',
  // Optional: set to a verified Google Maps directions URL. Otherwise the
  // supplied shared location opens, where guests can select Directions.
  directionsUrl: '',
  // Place the actual invitation in assets/ and set this to its relative path.
  // Example: 'assets/invitation.pdf'. Leave empty until the file exists.
  pdfUrl: 'assets/invitation.pdf',
  invitationPages: [
    {image: 'assets/invitation/page-1.jpg', thumbnail: 'assets/invitation/thumb-1.jpg', en: 'Sacred blessings', ta: 'இறையாசிகள்'},
    {image: 'assets/invitation/page-2.jpg', thumbnail: 'assets/invitation/thumb-2.jpg', en: 'Invitation cover', ta: 'அழைப்பிதழ் முகப்பு'},
    {image: 'assets/invitation/page-3.jpg', thumbnail: 'assets/invitation/thumb-3.jpg', en: 'Wedding invitation', ta: 'திருமண அழைப்பிதழ்'},
    {image: 'assets/invitation/page-4.jpg', thumbnail: 'assets/invitation/thumb-4.jpg', en: 'English invitation', ta: 'ஆங்கில அழைப்பிதழ்'},
    {image: 'assets/invitation/page-5.jpg', thumbnail: 'assets/invitation/thumb-5.jpg', en: 'Tamil invitation', ta: 'தமிழ் அழைப்பிதழ்'},
    {image: 'assets/invitation/page-6.jpg', thumbnail: 'assets/invitation/thumb-6.jpg', en: 'Family & celebrations', ta: 'குடும்பத்தினர் மற்றும் விழாக்கள்'}
  ],
  // Optional international phone number, digits only, e.g. country code + number.
  // When blank, guests choose a family contact themselves in WhatsApp.
  rsvpPhone: '',
  // Optional direct call buttons: [{name: 'Groom’s family', phone: '+91…'}]
  contacts: [],
  // Set this after GitHub Pages publishes, e.g. https://YOURNAME.github.io/wedding/
  // Blank uses the current page URL. Needed if generating links from a local file.
  siteUrl: 'https://nandakumar-anumitha.github.io/invitation/'
};
