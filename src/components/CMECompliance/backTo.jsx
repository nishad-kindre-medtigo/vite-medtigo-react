export const PageNav = ({ Title, backTo }) => {
    return (
      <Box sx={{ marginBottom: '10px' }} display={'flex'} flexDirection={'row'} alignContent={'center'} alignItems={'center'}>
        <Link
          style={{ padding: '0' }}
          to={{
            pathname: backTo,
          }}
        >
          <IconButton
            disableRipple
            sx={{
              padding: '0',
              marginRight: '5px',
              marginLeft: '-5px',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ color: '#000' }} />
          </IconButton>
  
        </Link>
        <Typography variant='h5' style={{ fontWeight: '500', fontSize:'24px', }}> {Title}</Typography>
      </Box>)
  }