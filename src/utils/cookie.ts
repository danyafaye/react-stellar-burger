type TCookieProps = {
  path?: string;
  expires?: number | Date | string;
  [key: string]: string | number | boolean | Date | undefined;
};

export function getCookie(name: string): string | undefined {
  const regExp = new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
  );

  const matches = regExp.exec(document.cookie);

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name: string, value: string, props: TCookieProps = {}): void {
  const cookieProps: TCookieProps = {
    path: '/',
    ...props,
  };

  let exp = cookieProps.expires;

  if (typeof exp === 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = cookieProps.expires = d;
  }

  if (exp instanceof Date) {
    cookieProps.expires = exp.toUTCString();
  }

  const encodedValue = encodeURIComponent(value);
  let updatedCookie = `${name}=${encodedValue}`;

  for (const propName in cookieProps) {
    const propValue = cookieProps[propName];

    if (propValue === false || propValue === undefined) {
      continue;
    }

    updatedCookie += `; ${propName}`;

    if (propValue !== true) {
      updatedCookie += `=${String(propValue)}`;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string): void {
  setCookie(name, '', { expires: -1 });
}
