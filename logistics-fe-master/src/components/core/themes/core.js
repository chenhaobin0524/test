export const navigate = (router, routerLink) => {
    if (routerLink.indexOf('open=browser') >= 0) {
        window.open(routerLink);
    } else if (routerLink.indexOf('http') >= 0) {
        router.push('/wonderful/' + encodeURIComponent(routerLink));
    } else {
        router.push({ path: routerLink });
    }
};