export const formatPrice = (price) => {
    return price.toString().slice(0, -5).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1.");
}