const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
//This is for Token validation
const jwt = require('jsonwebtoken');

class RequireAuthDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field) {

    const { resolve = defaultFieldResolver } = field;
    const { role } = this.args;

    field.resolve = async function(...args) {
      const [, , ctx] = args;
      if (!ctx || !ctx.encodedToken) {
        const error = new Error();
        error.name = "Error";
        error.message =  {"code":2001,"name":"Token","msg":"No authorization token."};
        throw error;
      }
      
      try {
        const token = ctx.encodedToken;
        const jwtPublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
        const decoded = jwt.verify(token, jwtPublicKey, 
          {
          algorithms: ["RS256"]
        }
        );
        ctx.authToken = decoded;
      
      } catch (err) {
        const error = new Error();
        error.name = "Error";
        error.message =  {"code":2001,"name":"Token","msg":"Invalid token."};

        throw error;
      }
        
        const result = await resolve.apply(this, args);
        return result;
    };
  }
}

module.exports = RequireAuthDirective;
