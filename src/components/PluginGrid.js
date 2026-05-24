import React from "react";
import { Grid } from "@mui/material";
import PluginCard from "./PluginCard";

function PluginGrid({
  plugins,
  currentPage,
  perPage,
  latestWpVersion,
  formatActiveInstalls,
  calculatePluginAge,
  calculateLastUpdated,
  getUpdatedMeta,
  onAuthorClick,
  onTagClick,
}) {
  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      {plugins.map((plugin, index) => (
        <Grid item key={plugin.slug} xs={12} sm={6} md={4} xl={3}>
          <PluginCard
            plugin={plugin}
            rank={(currentPage - 1) * perPage + index + 1}
            latestWpVersion={latestWpVersion}
            formatActiveInstalls={formatActiveInstalls}
            calculatePluginAge={calculatePluginAge}
            calculateLastUpdated={calculateLastUpdated}
            getUpdatedMeta={getUpdatedMeta}
            onAuthorClick={onAuthorClick}
            onTagClick={onTagClick}
            animationDelay={Math.min(index * 50, 400)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default PluginGrid;
