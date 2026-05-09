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
        p: { xs: 2.5, md: 3 },
        borderRadius: 5,
        border: "1px solid rgba(15, 23, 42, 0.06)",
        boxShadow: "0 4px 24px rgba(15, 23, 42, 0.04)",
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        display: "grid",
        gap: 2.5,
        animation: "fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both",
      }}
    >
      {/* Item range display */}
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            fontFeatureSettings: '"tnum"',
          }}
        >
          Showing{" "}
          <Box component="strong" sx={{ color: "text.primary", fontWeight: 800 }}>
            {startItem.toLocaleString()}
          </Box>
          {" – "}
          <Box component="strong" sx={{ color: "text.primary", fontWeight: 800 }}>
            {endItem.toLocaleString()}
          </Box>
          {" of "}
          <Box component="strong" sx={{ color: "primary.main", fontWeight: 800 }}>
            {totalPlugins.toLocaleString()}
          </Box>
          {" plugins"}
        </Typography>
      </Box>

      {/* Pagination component */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
          pb: 0.5,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { borderRadius: 99, bgcolor: "rgba(99,102,241,0.2)" },
        }}
      >
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
              borderRadius: 2.5,
              minWidth: 38,
              height: 38,
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "primary.light",
                color: "primary.dark",
              },
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              },
            },
          }}
        />
      </Box>

      {/* Jump to page */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1.25,
          pt: 1.5,
          borderTop: "1px solid rgba(15, 23, 42, 0.06)",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
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
            sx={{
              width: 112,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!jumpPage}
            sx={{ borderRadius: 2.5, minHeight: 40 }}
          >
            Go →
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default PaginationBar;
