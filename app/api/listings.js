import axios from 'axios'

import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);


const getFilenameFromUri = (uri) => {
  // Remove any query string or hash
  const cleanUri = uri.split('?')[0].split('#')[0];
  // Get the last path component
  return cleanUri.substring(cleanUri.lastIndexOf('/') + 1);
};



export const addListing = (listing, onUploadProgress) => {
  const endpoint = "http://192.168.1.3:9000/api/listings"
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);

  listing.images.forEach((image, index) => {
    const filename = getFilenameFromUri(image);

    data.append("images", {
      name: index + filename,
      type: "image/jpeg",
      uri: image,
    })
  });

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  return axios.post(endpoint, data, {
    onUploadProgress: (progress) => {
      if (progress.total) {
        const percent = progress.loaded / progress.total;
        onUploadProgress(percent);
      }
    } 
  })
  .then(response => {
    
    onUploadProgress(1);
    return { ok: true, data: response.data };
  })
  .catch(error => {
    console.log('Upload error:', error);
    return { ok: false, data: error.response?.data };
  });
};

export default {
  addListing,
  getListings,
};
