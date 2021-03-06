const bcrypt    =   require('bcrypt');
const jwt           =   require('jsonwebtoken');
const User 		=	require('../../models/user')
const mutate    =   {
    createUser: async (parent,args) => {
        const user = await User.findOne({email: args.inputUser.email})
         try{
             if(user) {
                 throw new Error("Ce mail existe déja")
             }
              bcrypt.hash(args.inputUser.password,12,async (err,hashed)=>{
                 if(hashed){
                     const user = await  new User({
                         nom: args.inputUser.nom,
                         prenom: args.inputUser.prenom,
                         email: args.inputUser.email,
                         password: hashed
                     }).save()
                       try{
                        return   user ? {...user._doc} : console.error(user+(" non ajouté"))
                       } catch(err){
                                 throw new err;
                             }
     
                 }else  {throw new Error(err);}

               
                 
             })
             
         }catch(err)
         {
             throw new Error('Erreur de validation motif: '+err);
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
   module.exports   =  mutate;