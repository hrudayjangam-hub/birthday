const Letter = require('../models/Letter');

const getLetter = async (req, res) => {
  try {
    const letter = await Letter.findOne().sort({ createdAt: -1 });
    if (!letter) {
      return res.status(404).json({ success: false, message: 'No letter found' });
    }
    res.json({ success: true, data: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const seedLetter = async () => {
  try {
    await Letter.findOneAndUpdate(
      {},
      {
        title: 'A Letter For You ❤️',
        content: `Oye... Maa mana ee relationship lo edi nee first birthday...🤗\n\nNenu first time chusinapudu netho friendship chedam ani anukunna... But lopala ekkado bayam 🥹..\n\nAla atha marriage lo nenu chusi inka flat ipoya...\n\nAla naku antu oka age vachina ventane nee gurinchi telusukovdam start chesaa🫠...\n\nLike nee hobbies enti, neku em istam... Em istam ledhu.. school lo ela untavu, clg lo ela untavu ani ☺️...\n\nAla naku time teliyakunda 2 years nee gurinchi telusukunna 🫴🏻...\n\nEppudu ayithe nenu babai valla house warming ceremony lo chusanooo eppudu nee direct ga matladi nv ante naku istam ani chudam ani anukunna... But bayam tho avvala kanisam nee insta id tesukoni ala naa feelings naku chpdam ani anukunna...\n\nEppudu ayithe nv naku nee insta id echavooo eppudu naa happyness 🥳ki boundries lev...\n\nNetho ala communication start chedam anukunna time lo nv naku post pettavu inka ala netho communication start CHESI🤳.... Naa 2 years research ki result vachindhee😚...\n\nInka ala nenu netho close avadam start chesa🫂....\n\nElane netho eppudu netho elagee untaa🫰🏻...\n\nI have one promise for you 💖\n\n*_PROMISE I WILL ALWAYS BE WITH YOU 💗🫂_*`
      },
      { upsert: true, new: true }
    );
    console.log('Letter seeded/updated');
  } catch (error) {
    console.error('Letter seed error:', error.message);
  }
};

module.exports = { getLetter, seedLetter };
