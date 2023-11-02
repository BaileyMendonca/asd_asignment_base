import { Box } from "@mui/material";
import stone from "./productImages/stone.jpeg";
import ProductPanels from "./ProductPanels";
import acupunture from "./productImages/acupunture.jpeg";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import facial from "./productImages/facial.png";

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
    name: "Facial",
    price: 60,
    image: facial,
  },
];

const LandingPage = () => {
  return (
    <Box sx={{ mx: 13 }}>
      <Box>Welcome to ASD Spa!</Box>
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

export default LandingPage;
