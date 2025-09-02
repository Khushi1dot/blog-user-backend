const Newsletter = require('../../models/newsletter.model');

class NewsletterController {
  // ... existing methods

  static async subscribeNewsletter(req, res) {
    console.log("Incoming request body:", req.body); 

    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required.' });
    }

    try {
      const alreadySubscribed = await Newsletter.findOne({ email });
      if (alreadySubscribed) {
        return res.status(409).json({ message: 'Already subscribed.' });
      }

      const newSub = new Newsletter({ email });
      await newSub.save();

      res.status(201).json({ message: 'Subscribed successfully.' });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}

module.exports = NewsletterController;
