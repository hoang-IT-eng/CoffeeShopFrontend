# Upload local public/frames/*.webp to Azure Blob CDN.
# Usage (from frontend/):  pwsh ./scripts/upload-frames-azure.ps1
param(
  [string]$Account = 'anroasteryframes',
  [string]$ResourceGroup = 'coffeeshop-rg',
  [string]$Container = 'frames'
)

$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot '..\public\frames' | Resolve-Path

# Prefer Azure AD (no account keys printed). Needs Storage Blob Data Contributor on the account.
az storage blob upload-batch `
  -d $Container `
  -s $src `
  --account-name $Account `
  --auth-mode login `
  --content-type image/webp `
  --overwrite true `
  --pattern '*.webp'

Write-Host "CDN base: https://$Account.blob.core.windows.net/$Container"
