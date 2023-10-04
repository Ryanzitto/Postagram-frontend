const soma = (req,res) => {
  const soma = 100 * 3
  res.send({ soma: soma})
}

module.exports = {soma}