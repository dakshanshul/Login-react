const bcrypt = require('bcrypt');

class Router {
    constructor(app,client){
        this.login(app,client);
        this.logout(app , client);
        this.isLoggedIn(app , client);
        }
        
        login(app , client){
            app.post('/login',(req,res) => {
                    let username = req.body.username;
                    let password = req.body.password;

                    username = username.toLowerCase();

                    if(username.length > 12 || password.length > 12)
                    {
                        res.json({
                            success: false,
                            msg: 'An error occured , please try again'
                        })
                        return;
                    }
                        let cols = [username];
                        client.query('select * from users where username = ? limit 1' , cols , (err , data , fields) => {
                            if(err){
                                res.json({
                                    success: false , 
                                    msg : 'An erro occured , please try again!'
                                })
                            return;
                            }
                            // found one user with the username 
                            if(data && data.length === 1)
                            {
                                bcrypt.compare(password , data[0].password ,(bcryptErr , verified) =>  {
                                    if(verified)
                                    {
                                        // req.session.userID = data[0].id;
                                        
                                        res.json({
                                            success: true,
                                            username: data[0].username
                                        })
                                        return ;

                                    }


                                    else {
                                        res.json({
                                            success: false,
                                            msg: 'Invalid password ' 
                                        })
                                    }
                                })
                            }
                        });
                    
            });
        }
        logout(app , client){
            app.post('/logout', (req,res) => {

                if (req.session.userID) 
                {
                    req.session.destroy();
                    res.json({
                        success:true
                    })
                    return true;
                }
                else {
                    res.json({
                        success: false 
                    })

                    return false ;
                }

            })

        }

        isLoggedIn(app , client){
             app.post('/isLoggedIn', (req,res) => {
                 if(res.session.userID){
                     let cols = [req.session.userID];
                     client.query('select * from user where id = ? limit 1' ,(err, data , fields) => {

                            if (data && data.length === 1){
                                res.json({
                                    success:true,
                                    username: data[0].username
                                })

                                return true ;
                            }

                            else {
                                res.json({
                                    success: false 
                                })
                            }


                     } );
                 }

                 else {
                     res.json({
                         success: false 
                     })
                 }
             })


        }
}

module.exports = Router ;