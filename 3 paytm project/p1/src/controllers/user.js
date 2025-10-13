

const updateBody=z.object({
    password:z.string().optional(),
    firstName:z.string().optional(),
    lastName:z.string().optional(),
});

export const updateUser = async (req, res, next) => {
    const { success} = updateBody.parse(req.body);
    if(!success){
        return res.status(411).json({ message: "Invalid request" });
    }
    
    await User.findByIdAndUpdate(req.params.id, { password, firstName, lastName }, { new: true });

    res.status(200).json({ message: "User updated successfully" });
}

// firstName or lastName has har as substring in it
export const getUser = async (req, res, next) => {
    const filter = req.query.filter || "";
    
    const user = await User.find({
        $or:[{
            firstName:{"$regex":filter},
            lastName:{"$regex":filter}
        }]
    });
    // above same thing using pipeline
    // const user =await User.pipeline([
    //     {
    //         $match:{
    //             $or:[{
    //                 firstName:{"$regex":filter},
    //                 lastName:{"$regex":filter}
    //             }]
    //         }
    //     },
    //     {
    //         $addFields:{
    //             fullName:{$concate:["$firstName"," ","$lastName"]}
    //         }
    //     },{
    //         $project:{
    //             fullName:1,
    //             firstName:1,
    //             lastName:1,
    //             email:1,
    //         }
    //     },
    //     {
    //         $sort:{
    //             fullName:1
    //         }
    //     },{
    //         $limit:15
    //     }
    // ])
    res.status(200).json(user);
}