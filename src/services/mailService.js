import sendgridMail from '@sendgrid/mail';

const sendPasswordRecoveryMail = ({ email, token }) => {
  const link =
    process.env.NODE_ENV === 'prod'
      ? 'https://rubix-store.vercel.app/'
      : 'http://localhost:3000/';

  sendgridMail.setApiKey(process.env.SENGRID_API_KEY);

  const mailMessage = `
	<h1>Para recuperar sua senha, clique no link abaixo<h1>
	<a href="${link}recover?token=${token}"">Clique aqui</a>
	<h5>Se você não solicitou esse e-mail, desconsidere-o</h5>
  `;

  const mail = {
    to: email,
    from: 'rubix.store.oficial@gmail.com',
    subject: 'Recuperação de senha',
    html: mailMessage,
  };

  sendgridMail.send(mail);

  return true;
};

const sendPurchaseConfirmationEmail = ({ email, totalValue }) => {
  sendgridMail.setApiKey(process.env.SENGRID_API_KEY);

  const mailMessage = `
        <h1>Rubix Store<h1>
        <h3>Obrigado por comprar conosco!</h3>
        <h4>Valor total da compra: R$ ${totalValue / 100}</h4>
    `;

  const mail = {
    to: email,
    from: 'rubix.store.oficial@gmail.com',
    subject: 'Compra aprovada!',
    html: mailMessage,
  };

  sendgridMail.send(mail);
};

export { sendPasswordRecoveryMail, sendPurchaseConfirmationEmail };
