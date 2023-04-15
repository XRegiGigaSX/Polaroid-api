import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        // console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        // const isCustomAuth = token.length < 500;

        let decodedData;

        decodedData = jwt.verify(token, 'test');
        req.userId = decodedData?.id;
        console.log(req.userId);

        // if(token && isCustomAuth){
            
        // }else{
        //     decodedData = jwt.decode(token);
        //     req.userId = decodedData?.sub;
        // }
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;