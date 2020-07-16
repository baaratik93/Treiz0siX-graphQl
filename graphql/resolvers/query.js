 const User 		=	require('../../models/user');
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
        
    }
   }
   module.exports   =   query;