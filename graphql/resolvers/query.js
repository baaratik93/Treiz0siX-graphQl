 const User 		=	require('../../models/user');
  const { findOne } = require('../../models/user');
const bcrypt        =   require('bcrypt');
const jwt           =   require('jsonwebtoken');
const query = {
    users: async () => {
        const users = await User.find()
            try
            {
                    return users.map(user=>{
                        return {
                                ...user._doc,
                                    _id: user.id
                            };
                    })
            }catch(err)
            {
                throw err;
            }
        
    },
    login: async(parent,args)   =>  {
        let user = await User.findOne({email: args.credentials.email})
        try {
                if(!user) console.error("L'utilisateur n'existe pas")
               const  match    =   await bcrypt.compare(args.credentials.password, user.password);
                try{
                   const  token = match ? jwt.sign({_id: user._id,email: user.email}, "private", { expiresIn: "1h" })  :   "Mot de passe incorrect";
                   return {
                    _id: user._id,
                    token: token,
                    tokenExpiration: 1
                }
                }catch(err)
                {
                    throw err;
                }
            
        } catch(err)
        {
            throw err;
        }
    }
   }
   module.exports   =   query;