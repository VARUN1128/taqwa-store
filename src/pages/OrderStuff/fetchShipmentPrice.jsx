import axios from "axios";

const fetchShipmentPrice = async ({
  paymentType,
  destinPin,
  weight,
  token,
}) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_ORDER_URL}/shipment-cost`,
      {
        params: {
          pt: paymentType,
          dp: destinPin,
          wt: weight,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return {
      type: response.data.type,
      charged_weight: response.data.charged_weight,
      tax_data: response.data.tax_data,
      charge_DL: response.data.charge_DL,
      charge_DPH: response.data.charge_DPH,
      charge_COD: response.data.charge_COD,
      gross_amount: response.data.gross_amount,
      total_amount: response.data.total_amount,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch shipment price"
    );
  }
};

export default fetchShipmentPrice;
