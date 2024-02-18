const generateRandomString  = ( text: String = "Key") :any => {
  return `${text}-${Math.random()* 100000}`
}


export { generateRandomString }