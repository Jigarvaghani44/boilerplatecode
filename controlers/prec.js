

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
      if (id === 1) {
        resolve({ id: 1, name: "John Doe" });
      } else {
        reject(new Error("User not found"));
      }
    });
  };
  
  module.exports={
    add:async (a,b)=>{
        return await a + b
    },
    getUserById
}