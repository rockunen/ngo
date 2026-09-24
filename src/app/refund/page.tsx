import Link from "next/link";

export default function Refund() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pink-600 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refund, Cancellation & Return Policy
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none text-gray-700 space-y-6">
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refund and Cancellation policy</h2>
          <p>
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Cancellations will only be considered if the request is made 1 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
            </li>
            <li>
              9205221482 does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.
            </li>
            <li>
              In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 1 days of receipt of products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 1 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
            </li>
            <li>
              In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.
            </li>
            <li>
              In case of any refunds approved by 9205221482, it will take 1 days for the refund to be processed to you.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Return Policy</h2>
          <p>
            We offer refund / exchange within first 1 days from the date of your purchase. If 1 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind. In order to become eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as you received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale, then the item may not be eligible for a return / exchange. Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.
          </p>
          <p>
            You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase. For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further. If the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Shipping Policy</h2>
          <p>
            The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within 1 days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of purchase. Delivery of our services will be confirmed on your email ID as specified at the time of registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
          </p>
        </div>
      </section>
    </div>
  );
}
