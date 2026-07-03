const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export function decodeCloudflareEmail(encoded: string): string | null {
  if (!encoded || encoded.length < 4 || encoded.length % 2 !== 0) return null;

  try {
    const key = parseInt(encoded.slice(0, 2), 16);
    let email = "";

    for (let i = 2; i < encoded.length; i += 2) {
      email += String.fromCharCode(parseInt(encoded.slice(i, i + 2), 16) ^ key);
    }

    return EMAIL_REGEX.test(email) ? email.toLowerCase() : null;
  } catch {
    return null;
  }
}

export function revealCloudflareEmailsInHtml(html: string): string {
  let result = html;

  result = result.replace(/data-cfemail="([a-f0-9]+)"/gi, (_match, hex: string) => {
    const email = decodeCloudflareEmail(hex);
    return email ? `data-decoded-email="${email}"` : `data-cfemail="${hex}"`;
  });

  result = result.replace(
    /href="\/cdn-cgi\/l\/email-protection#([a-f0-9]+)"/gi,
    (_match, hex: string) => {
      const email = decodeCloudflareEmail(hex);
      return email ? `href="mailto:${email}"` : `href="/cdn-cgi/l/email-protection#${hex}"`;
    },
  );

  result = result.replace(
    /href='\/cdn-cgi\/l\/email-protection#([a-f0-9]+)'/gi,
    (_match, hex: string) => {
      const email = decodeCloudflareEmail(hex);
      return email ? `href='mailto:${email}'` : `href='/cdn-cgi/l/email-protection#${hex}'`;
    },
  );

  result = result.replace(
    /var firstHalf = "([^"]+)";\s*var secondHalf = "([^"]+)";/gi,
    (_match, first: string, second: string) => {
      const email = `${first}@${second}`.toLowerCase();
      return EMAIL_REGEX.test(email)
        ? `data-decoded-email="${email}" var firstHalf = "${first}"; var secondHalf = "${second}";`
        : `var firstHalf = "${first}"; var secondHalf = "${second}";`;
    },
  );

  return result;
}
