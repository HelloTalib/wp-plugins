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
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 5,
        border: "1px solid rgba(15, 23, 42, 0.05)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        bgcolor: "#ffffff",
        display: "grid",
        gap: 2.5,
        animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            fontFeatureSettings: '"tnum"',
            fontSize: "0.85rem",
          }}
        >
          Showing{" "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
            {startItem.toLocaleString()}
          </Box>
          {" – "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
            {endItem.toLocaleString()}
          </Box>
          {" of "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: 800 }}>
            {totalPlugins.toLocaleString()}
          </Box>{" "}
          plugins
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          my: 1,
          overflow: "hidden",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, p) => onPageChange(p)}
          size="medium"
          siblingCount={0}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 800,
              borderRadius: 3,
              height: { xs: 36, sm: 44 },
              minWidth: { xs: 36, sm: 44 },
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.05)",
                color: "primary.main",
              },
              "&.Mui-selected": {
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                },
              },
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
          gap: 1.5,
          pt: 2.5,
          borderTop: "1px solid rgba(15, 23, 42, 0.04)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}
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
              width: 100,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "rgba(15, 23, 42, 0.02)",
                "& fieldset": { borderColor: "rgba(15, 23, 42, 0.08)" }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!jumpPage}
            sx={{ borderRadius: 2.5, height: 40, px: 3, boxShadow: "none" }}
          >
            GO
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default PaginationBar;
