import React from "react";
import logo from "./../Home/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import videoFile from "./Anthem_V6.mp4";
import Navbar from "./NavBar";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  Button
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn
} from "@mui/icons-material";

const Footer = () => {
    const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#1a2b3c", color: "#fff", pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                     <img src={logo} alt="Skillora Logo" style={{ height: 40, filter: "brightness(0) invert(1)" }} />
                     <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
                        Skillora
                    </Typography>
                </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 300, lineHeight: 1.6 }}>
                Empowering learners worldwide with accessible, high-quality courses. Join our community and start your journey today.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", '&:hover': { bgcolor: "#007791" } }}><Facebook /></IconButton>
              <IconButton size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", '&:hover': { bgcolor: "#007791" } }}><Twitter /></IconButton>
              <IconButton size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", '&:hover': { bgcolor: "#007791" } }}><Instagram /></IconButton>
              <IconButton size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", '&:hover': { bgcolor: "#007791" } }}><LinkedIn /></IconButton>
              <IconButton size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", '&:hover': { bgcolor: "#007791" } }}><YouTube /></IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#007791", mb: 2 }}>
              Company
            </Typography>
            <Stack spacing={1.5}>
              <Link component={NavLink} to="/about" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>About Us</Link>
              <Link component={NavLink} to="/careers" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>Careers</Link>
              <Link component={NavLink} to="/blog" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>Blog</Link>
              <Link component={NavLink} to="/contact" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>Contact Us</Link>
            </Stack>
          </Grid>

           {/* Support */}
           <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#007791", mb: 2 }}>
              Support
            </Typography>
            <Stack spacing={1.5}>
              <Link component={NavLink} to="/help" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>Help Center</Link>
              <Link component={NavLink} to="/terms" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>Terms of Service</Link>
              <Link component={NavLink} to="/policy" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>Privacy Policy</Link>
              <Link component={NavLink} to="/faq" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: "0.9rem" }}>FAQ</Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
           <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#007791", mb: 2 }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Email sx={{ color: "#007791" }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>support@skillora.com</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <Phone sx={{ color: "#007791" }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>+1 (555) 123-4567</Typography>
                </Box>
                 <Box display="flex" alignItems="center" gap={2}>
                    <LocationOn sx={{ color: "#007791" }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>123 Education Lane, Tech City, CA 94043</Typography>
                </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.6, fontSize: "0.85rem" }}>
                © {new Date().getFullYear()} Skillora Inc. All rights reserved.
            </Typography>
            <Box mt={{ xs: 2, md: 0 }}>
                <Link href="#" color="inherit" sx={{ opacity: 0.6, mx: 1, fontSize: "0.85rem", textDecoration: 'none' }}>Privacy</Link>
                <Link href="#" color="inherit" sx={{ opacity: 0.6, mx: 1, fontSize: "0.85rem", textDecoration: 'none' }}>Terms</Link>
                <Link href="#" color="inherit" sx={{ opacity: 0.6, mx: 1, fontSize: "0.85rem", textDecoration: 'none' }}>Sitemap</Link>
            </Box>
        </Box>
      </Container>
    </Box>
  );
};


export const AboutUs = () => {
    // Keeping AboutUs structure but using Box/Typography for better integration if needed later.
    // Ideally this should be its own file, but adhering to current structure.
  return (
    <>
    <Navbar/>
    {/* Refactored AboutUs using inline styles for now to simply maintain it while fixing Footer */}
    <Box sx={{ width: '100%' }}>
      {/* Section with Video Background */}
      <Box sx={{ position: 'relative', height: '60vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <video 
            autoPlay 
            muted 
            loop 
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                zIndex: -1 
            }}
        >
          <source src={videoFile} type="video/mp4" />
        </video>
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.5)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} /> {/* Overlay */}
        
        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#007791", letterSpacing: 2, mb: 2, textTransform: 'uppercase', bgcolor: 'rgba(255,255,255,0.9)', display: 'inline-block', px: 2, py: 0.5, borderRadius: 1 }}>
            Our Vision
          </Typography>
          <Typography variant="h3" fontWeight="800" sx={{ lineHeight: 1.2 }}>
            We envision a world where <span style={{ color: "#007791" }}>anyone, anywhere</span> has the power to
            transform their lives through learning.
          </Typography>
        </Container>
      </Box>

      {/* Partner Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="body1" fontSize="1.2rem" color="text.secondary" maxWidth="800px" mx="auto" mb={6}>
          We partner with more than 300 leading universities and companies to
          bring flexible, affordable, job-relevant online learning to individuals and
          organizations worldwide. We offer a range of learning opportunities—from
          hands-on projects and courses to job-ready certificates and degree programs.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
          <img 
            src="https://images.ctfassets.net/00atxywtfxvd/4vOWgNjy4KExR8msqHnJEP/bb1557d60e8a29f6a5f09148f700bff5/partner-logos.png" 
            alt="Partner Logos" 
            style={{ maxWidth: '100%', height: 'auto', filter: 'grayscale(100%)', opacity: 0.7 }} 
          />
        </Box>
      </Container>
    </Box>
    <Footer/>
    </>
  );
};

export default Footer;
