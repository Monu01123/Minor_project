import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, results }) => {
  const navigate = useNavigate();

  const handleResultClick = (courseId) => {
    onClose();
    navigate(`/courses/${courseId}`);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Search Results</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {results && results.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {results.map((course) => (
              <ListItem 
                button 
                key={course.course_id} 
                onClick={() => handleResultClick(course.course_id)}
                sx={{ 
                    borderRadius: 2, 
                    mb: 1, 
                    '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    variant="rounded" 
                    src={course.image_url} 
                    alt={course.title}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="600">
                      {course.title}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No matching courses found.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
