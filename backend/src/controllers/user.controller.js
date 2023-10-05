const create = (req,res) => {
const {name, userName, email, password, avatar} = req.body

if (!name || !userName || !email || !password || !avatar){
    res.status(400).send({message: "Submit all fields for registration"})
}

res.status(201).send({
    message: "User created successfully",
    user : {
        name,
        userName,
        email,
        avatar
    },
})
}


module.exports = {create}

//3RuDrjP94ropX9MC