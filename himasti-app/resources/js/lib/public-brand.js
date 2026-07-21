export const DEFAULT_PUBLIC_LOGO = "/img/logo/logoHimasti.png";

export function resolvePublicLogo(publicProfileMeta) {
    return publicProfileMeta?.logo
        ? `/storage/${publicProfileMeta.logo}`
        : DEFAULT_PUBLIC_LOGO;
}
