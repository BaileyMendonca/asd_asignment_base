import { useAuth0 } from "@auth0/auth0-react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
}

const ProductCard = ({ image, name, price }: ProductCardProps) => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <Card
      sx={{ backgroundColor: "#2196f3", color: "white", width: "20%", m: 5 }}
    >
      <CardMedia component="img" height="200" src={image} alt={name} />
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          ${price}
        </Typography>
        <Button
          sx={{
            backgroundColor: "white",
            color: "#2196f3",
            fontWeight: "bold",
            mt: 2,
          }}
          onClick={() => {
            if (user) {
              alert(
                `Thanks, ${user.name} Enquiry sent! a tech will get back to you.`
              );
            } else {
              alert(
                "Sorry, our online equiry only works for logged in users, please register an account or give us a call on 0409222222"
              );
            }
          }}
        >
          Enquire now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
