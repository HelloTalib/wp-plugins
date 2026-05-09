import React from "react";
import { Box, Button, Paper, Pagination, TextField, Typography } from "@mui/material";

function PaginationBar({
  currentPage,
  totalPages,
  totalPlugins,
  perPage,
  jumpPage,
  setJumpPage,
  onPageChange,
}) {
  const startItem = totalPlugins === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalPlugins);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        border: "1px solid rgba(30, 41, 59, 0.09)",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
        bgcolor: "rgba(255,255,255,0.96)",
        display: "grid",
        gap: 2,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Showing <strong>{startItem}</strong> – <strong>{endItem}</strong> of{" "}
          <strong>{totalPlugins.toLocaleString()}</strong>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", overflowX: "auto", pb: 0.5 }}>
        <Pagination
          color="primary"
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => onPageChange(value)}
          siblingCount={1}
          boundaryCount={1}
          size="medium"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 700,
              borderRadius: 2,
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              boxShadow: "0 6px 16px rgba(34, 113, 177, 0.25)",
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Jump to page
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            const pageNum = parseInt(jumpPage, 10);
            if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
              onPageChange(pageNum);
              setJumpPage("");
            }
          }}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <TextField
            size="small"
            type="number"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            placeholder={`1–${totalPages}`}
            inputProps={{ min: 1, max: totalPages }}
            sx={{ width: 112 }}
          />
          <Button type="submit" variant="contained" disabled={!jumpPage}>
            Go
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default PaginationBar;
