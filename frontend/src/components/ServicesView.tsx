import Grid2 from "@mui/material/Unstable_Grid2";
import ProductPanels from "./ProductPanels";
import stone from "./productImages/stone.jpeg";

import acupunture from "./productImages/acupunture.jpeg";

import facial from "./productImages/facial.png";
import { Box, Typography } from "@mui/material";

const ServicesView = () => {
  const services = [
    {
      name: "Hot Stone Massage",
      price: 320,
      image: stone,
    },
    {
      name: "Acupunture",
      price: 130,
      image: acupunture,
    },
    {
      name: "Facial CHANGED FOR DEPLOYMENT",
      price: 60,
      image: facial,
    },
  ];

  return (
    <Box>
      <Typography variant="h4"> Our Services</Typography>
      <Grid2 container spacing={2}>
        {services.map((service) => (
          <ProductPanels
            name={service.name}
            price={service.price}
            image={service.image}
          />
        ))}
      </Grid2>
    </Box>
  );
};

export default ServicesView;
