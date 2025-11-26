
// <!-- store balance integer because database and js has the precesion issue -->
// there is presitoin isssue in js as well as in database so you will never store decimals in db
// if balacnce is 88.88 then you will store it as 8888 and somewhere in constant you put 2 decimals we support and tuse that function everywhere
// if someone sends 88.80999 rs then you can trough error that we only support 2 decimals so do not try to send

// in money relate transenction either everyting should happen or nothing should 
//     when you are executing the traction of one person sending mongy to other person


// 1 do transection management(
// 2 two traction or concurrent traction should not get executed in parallel(what if user1 has only 100 rs and two 
// 100 rs transection get executed) so here i try to fool the if check to cheeck the insufficent balance by sending 
// the concurrent reqs, so if check is there then if should run first for first transection and then for the second
// transection

// above both case get converd bellow

// await - mean thread is not stuck her it push is in to some queue to be process and  start handdleing another request

const transferMoney = async (fromAccountId, toAccountId, amount) => {

    const session = await mongoose.startSession();

    session.startTransaction(); 

    // is this user has enough balance to send 
    const fromAccount = await Account.findById(fromAccountId).session(session);
    if(!fromAccount.balance || fromAccount.balance < amount){
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({ message: "Insufficient balance" });
    }

     // to full above check with con
    // await new Promise(resolve => setTimeout(resolve, 10000)); 

    const toAccount = await Account.findById(toAccountId).session(session);

    if(!toAccount){
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({ message: "Account not found" });
    }
   
    await Account.findByIdAndUpdate(fromAccountId, { $inc: { balance: -amount } }).session(session);

    await Account.findByIdAndUpdate(toAccountId, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({ message: "Money transferred successfully" }); 
}



// 1 when user sign up give them some rendom balance between 100 to 1000 (when user opens there account)

export const signup = async (req, res, next) => {
//    const {}
}
