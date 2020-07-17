 const User 		=	require('../../models/user');
 const isAuth       =   require('../../middlewares/is-auth')
const query = {
    users: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Veuillez vous identifier");
        }
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
        
    }
   }
   module.exports   =   query;