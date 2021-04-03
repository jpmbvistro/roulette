module.exports = function(app, db, passport, uniqid, ObjectId) {

const board = {
  0:'green',
  1:'red',
  2:'black',
  3:'red',
  4:'black',
  5:'red',
  6:'black',
  7:'red',
  8:'black',
  9:'red',
  10:'black',
  11:'black',
  12:'red',
  13:'black',
  14:'red',
  15:'black',
  16:'red',
  17:'black',
  18:'red',
  19:'red',
  20:'black',
  21:'red',
  22:'black',
  23:'red',
  24:'black',
  25:'red',
  26:'black',
  27:'red',
  28:'black',
  29:'black',
  30:'red',
  31:'black',
  32:'red',
  33:'black',
  34:'red',
  35:'black',
  36:'red',
}

let roll = function(){
  return Math.floor(Math.random()*36+1)
}

/********************
=====Base routes=====
*********************/

    // Load root index ===================================================
    app.get('/', function(req, res) {
      res.render('index.ejs', {
        message: req.flash('loginMessage')
      })
      // res.redirect('/dashboard')
    })

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
      res.render('signup.ejs', {
        message: req.flash('signupMessage')
      })
    })

    app.get('/management', isLoggedIn, (req, res)=>{
      db.collection('bets').find().toArray((err,result)=>{
        let totalLoss = result.reduce((acc, current)=>acc+current.winnings)
        if(err) return console.log(err)
        res.render('management.ejs', {
          bets:result

        })
      })
    })

    /**************************
    =====Dashboard routes=====
    **************************/

    app.get('/dashboard', function(req, res) {
      db.collection('foodAid').find().toArray((err, result) => {
        if(err) return console.log(err)
        res.render('dashboard.ejs', {
          foodaid: result,
          title: 'Dashboard'
        })
      })
    })

    app.post('/bet', function(req, res) {
      let resultNum = roll()
      console.log(resultNum)
      let resultColor = board[resultNum]
      let winnings = 0
      if(req.body.blackBet){
        winnings = resultColor ==='black' ? winnings + Number(req.body.blackBet) : winnings - Number(req.body.blackBet)
      }
      if(req.body.redBet){
        winnings = resultColor ==='red' ? winnings + Number(req.body.redBet) : winnings - Number(req.body.redBet)
      }
      if(req.body.evenBet){
        winnings = resultNum%2 ? winnings - Number(req.body.evenBet) : winnings + Number(req.body.evenBet)
      }
      if(req.body.oddBet){
        winnings = resultNum%2 ? winnings + Number(req.body.oddBet) : winnings - Number(req.body.oddBet)
      }
      if(req.body.firstDBet){
        winnings = resultNum>=1&&resultNum<=12 ? winnings + Number(req.body.firstDBet)*2 : winnings - Number(req.body.firstDBet)
      }
      if(req.body.secondDBet){
        winnings = resultNum>=13&&resultNum<=24 ? winnings + Number(req.body.secondDBet)*2 : winnings - Number(req.body.secondDBet)
      }
      if(req.body.thirdDBet){
        winnings = resultNum>=25&&resultNum<=36 ? winnings + Number(req.body.thirdDBet)*2 : winnings - Number(req.body.thirdDBet)
      }
      if(req.body.firstCBet){
        winnings = resultNum%3===1 ? winnings + Number(req.body.firstCBet)*2 : winnings - Number(req.body.firstCBet)
      }
      if(req.body.secondCBet){
        winnings = resultNum%3===2 ? winnings + Number(req.body.secondCBet)*2 : winnings - Number(req.body.secondCBet)
      }
      if(req.body.thirdCBet){
        winnings = resultNum%3===1 ? winnings + Number(req.body.thirdCBet)*2 : winnings - Number(req.body.thirdCBet)
      }
      if(req.body.singleBets){
        let nums = Object.keys(req.body.singleBets)
        nums.forEach((item,i) => {
          winnings = resultNum == item ? winnings + Number(req.body.singleBets[item]) * 35 : winnings - Number(req.body.singleBets[item])
        })
      }
      db.collection('bets').insertOne({
        name: req.body.name,
        winnings: winnings
      }, (err, result) => {
        if (err) return console.log(err)
        res.send({
          result: result,
          winnings: winnings,
          number: resultNum,
          color: resultColor,
        })
      })
    })

    app.put('/request', function(req, res) {
      db.collection.findOneAndUpdate({
        _id:req.body._id
      }, {
        $set:
          {
            status: 'request',
            requestor: req.body.userID
          }
      }, {
        sort: {_id: -1},
        upsert:true
      }, (err, result) => {
        if(err) return res.send(err)
        res.send(result)
      })
    })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/management', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/management', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
