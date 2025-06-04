import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Dialog, DialogContent, InputAdornment, TextField, IconButton, Box, Typography, Fade, styled } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { GradientCircularProgress } from 'src/ui/Progress';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

const SearchField = styled(TextField)(() => ({
  borderColor: '#8B8B8B',
  '& .MuiInputBase-root': {
    borderBottom: 'none !important',
    borderRadius: '2px',
    height: '57px !important',
    fontSize: '20px',
    fontWeight: 500
  }
}));

const StyledSuggestionBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: "8px",
  padding: "8px 16px",
  width: '100%',
  cursor: 'pointer',
  borderRadius: '2px',
  '&:hover': {
    background: '#EBF5FF',
  },
});

const fetchSuggestions = debounce(async (query, setLoading, setSuggestionsList, openSnackbar) => {
  if (!query || query.length < 3) return;

  setLoading(true);
  try {
    const response = await fetch(
      `https://medtigo.com/wp-json/medtigo/v1/search_results?email=bgediya%40medtigo.com&device=web&search_query=${query}`
    );
    const { result } = await response.json();
    setSuggestionsList(result.slice(0, 4));
  } catch (error) {
    openSnackbar('Error fetching suggestions: ', error)
  } finally {
    setLoading(false);
  }
}, 300);

export const SearchBar = ({ openSearchDialog, setOpenSearchDialog }) => {
  const [searchText, setSearchText] = useState('');
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const openSnackbar = useOpenSnackbar();

  const handleSearch = useCallback(() => {
    fetchSuggestions(searchText, setLoading, setSuggestionsList, openSnackbar);
  }, [searchText]);

  useEffect(() => {
    handleSearch();
  }, [searchText, handleSearch]);

  const handleSearchDialogClose = () => {
    setSearchText('');
    setOpenSearchDialog(false);
    setSuggestionsList([]);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSuggestionsList([]);
  };

  const handleClick = (post) => {
    window.open(post.post_permalink, '_blank');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const searchQuery = searchText.trim();
      if (searchQuery) {
        const url = `https://medtigo.com/?s=${searchQuery}`;
        window.open(url, '_blank');
      }
    }
  };

  return (
    <Dialog open={openSearchDialog} onClose={handleSearchDialogClose} TransitionComponent={FadeTransition} PaperProps={{ style: { width: '750px', borderRadius: '2px' } }}>
      <DialogContent>
        <SearchField
          fullWidth
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize='large' style={{color: '#2872C1'}} />
              </InputAdornment>
            ),
            endAdornment: (
              searchText.length>0 &&
                 <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <CloseRoundedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" flexDirection="column" gap={2} mt={suggestionsList.length > 0 ? 2 : 0} justifyContent="center" alignItems="center">
          {loading ? (
            <GradientCircularProgress />
          ) : suggestionsList.length > 0 ? (
            suggestionsList.map((suggestion) => (
              <StyledSuggestionBox key={suggestion.id} onClick={() => handleClick(suggestion)}>
                <SearchRoundedIcon fontSize='30px' />
                <Typography sx={{fontSize: '16px', fontWeight: 400}}>{suggestion.post_title}</Typography>
              </StyledSuggestionBox>
            ))
          ) : (
            searchText && (
              <Typography sx={{ mt: 2, fontSize: '16px', fontWeight: 400}}>
                No suggestions found.
              </Typography>
            )
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const FadeTransition = React.forwardRef(function FadeTransition(props, ref) {
  return <Fade in={true} ref={ref} {...props} />;
});