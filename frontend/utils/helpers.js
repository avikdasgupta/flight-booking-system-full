export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const getDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

export const cityNameFromCode = (code) => {
  const cities = {
    CCU: 'Kolkata', DEL: 'Delhi', BOM: 'Mumbai', MAA: 'Chennai',
    BLR: 'Bengaluru', HYD: 'Hyderabad', AMD: 'Ahmedabad', PNQ: 'Pune',
    GOI: 'Goa', JAI: 'Jaipur', LKO: 'Lucknow', ATQ: 'Amritsar',
  };
  return cities[code] || code;
};
