module.exports = {
	name: 'decbin',
	aliases: [],
	description: 'converte um numero decimal em binario com um determinado numero de bits',
	usage: '<numerodecimal> <numero de bits>',
	args: true,

	execute(message, args) {

		if (args.length < 2) {
			message.channel.send('Eu preciso de mais argumentos');


		}
		else {
			numero = parseInt(args[0]);
			tamanho = parseInt(args[1]);
			// console.log(intpot(3, 2));

			//	message.channel.send(`${message.author.username} mandou ${nome} ir catar coquinho`);

			const response = printbinary(numero, tamanho);
			try {
				message.channel.send('O número ' + numero + ' em binário é ' + response);
			}
			catch (error) {
				message.channel.send('erro');
			}
		}


	},
};


function intpot(x, n) {
	/* receive x and n, and return x^n */
	let result = x;
	for (let i = 1; i < n; i++) {
		result *= x;
	}
	return 1 * (n == 0) + (n != 0) * result;
}

function printbinary(x, nbits, response) {
    if(nbits > 40) nbits = 40;
	response = '';

	if (x < 0) {
		x += 1;
		x = -x;
		for (let i = 1; i <= nbits; i++) {
			response += 1 * ((x - intpot(2, nbits - i) < 0));
			// printf("%d", 1 * ((x - intpot(2, nbits - i) < 0)));
			x -= intpot(2, nbits - i) * (!(x - intpot(2, nbits - i) < 0));
		}
	}
	else {
		/* receive an integer, x, and print its binary version with nbits length*/
		for (let i = 1; i <= nbits; i++) {
			response += 1 * (!(x - intpot(2, nbits - i) < 0));
			// printf("%d", 1 * (!(x - intpot(2, nbits - i) < 0)));
			x -= intpot(2, nbits - i) * (!(x - intpot(2, nbits - i) < 0));
		}
	}
	return response;

}