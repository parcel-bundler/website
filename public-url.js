switch (process.env.VERCEL_ENV) {
  case 'production':
    process.stdout.write('https://parceljs.org');
    break;
  case 'preview':
    process.stdout.write('https://' + process.env.VERCEL_URL);
    break;
  default:
    process.stdout.write('/');
    break;
}
