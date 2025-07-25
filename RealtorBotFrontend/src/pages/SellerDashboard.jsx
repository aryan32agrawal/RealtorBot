import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../components/ListingsContext';
import { useAuth } from '../components/AuthContext';
import { toursAPI } from '../services/api';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { listings, loading } = useListings();
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [toursError, setToursError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      setToursLoading(true);
      setToursError(null);
      try {
        const response = await toursAPI.getSellerTours();
        setTours(response.tours || []);
      } catch (err) {
        setToursError('Failed to load upcoming tours.');
      } finally {
        setToursLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleAddListing = () => {
    navigate('/add-edit-listing');
  };

  const handleConversationalAI = () => {
    navigate('/chat');
  };

  const handleViewListing = (id) => {
    console.log('Viewing listing with ID:', { id, type: typeof id });
    navigate(`/listing/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading your listings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>
      
      {user && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome back, {user.email}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleAddListing}>
          Add New Listing
        </Button>
        <Button variant="contained" color="secondary" onClick={handleConversationalAI}>
          AI Assistant - Create Listing
        </Button>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Your Active Listings ({listings.length})
      </Typography>
      
      {listings.length === 0 ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              You haven't created any listings yet. Click "Add New Listing" or use our AI Assistant to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {listings.map(listing => (
            <ListItem key={listing.id} disablePadding sx={{ mb: 2 }}>
              <Card
                sx={{
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, background 0.2s',
                  '&:hover': {
                    boxShadow: 8,
                    background: '#f0f4ff',
                  },
                }}
                elevation={3}
                onClick={() => handleViewListing(listing.id)}
              >
                <CardContent>
                  <Typography variant="subtitle1">{listing.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {[listing.street, listing.city, listing.state, listing.zip].filter(Boolean).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${listing.price?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {listing.status}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Recent Offers & Messages
      </Typography>
      {/* Placeholder for offers/messages */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No recent offers or messages.
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="h6" gutterBottom>
        Upcoming Tours
      </Typography>
      {toursLoading ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Loading upcoming tours...
            </Typography>
          </CardContent>
        </Card>
      ) : toursError ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="error">
              {toursError}
            </Typography>
          </CardContent>
        </Card>
      ) : tours.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              No upcoming tours.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {tours.map(tour => (
            <ListItem key={tour.id} disablePadding sx={{ mb: 2 }}>
              <Card sx={{ width: '100%' }} elevation={2}>
                <CardContent>
                  <Typography variant="subtitle1">
                    {tour.street}, {tour.city}, {tour.state} {tour.zip}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {tour.scheduled_date} &nbsp; Time: {tour.scheduled_time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Buyer ID: {tour.buyer_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {tour.status}
                  </Typography>
                  {tour.notes && (
                    <Typography variant="body2" color="text.secondary">
                      Notes: {tour.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SellerDashboard;