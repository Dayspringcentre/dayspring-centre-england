param([ValidateSet('project','deploy','status')][string]$Action = 'status')
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
$authPath = Join-Path $env:APPDATA 'com.vercel.cli/Data/auth.json'
$auth = Get-Content -LiteralPath $authPath -Raw | ConvertFrom-Json
$headers = @{ Authorization = 'Bearer ' + $auth.token }
$projectName = 'dayspring-centre-england'
if ($Action -eq 'project') {
  $body = @{name=$projectName; framework=$null; buildCommand=''; outputDirectory='.'} | ConvertTo-Json -Depth 8
  $project = Invoke-RestMethod 'https://api.vercel.com/v11/projects' -Method Post -Headers $headers -ContentType 'application/json' -Body $body
  New-Item -ItemType Directory -Force (Join-Path $taskRoot '.vercel') | Out-Null
  @{projectId=$project.id;orgId=$project.accountId;projectName=$project.name} | ConvertTo-Json | Set-Content (Join-Path $taskRoot '.vercel/project.json')
  @{id=$project.id;name=$project.name;linkedRepo=$project.link.repo;accountId=$project.accountId} | ConvertTo-Json
}
elseif ($Action -eq 'deploy') {
  $project = Get-Content (Join-Path $taskRoot '.vercel/project.json') -Raw | ConvertFrom-Json
  $files = @()
  $paths = @(Get-ChildItem -LiteralPath $taskRoot -File | Where-Object { $_.Extension -eq '.html' -or $_.Name -in @('vercel.json','sitemap.xml','robots.txt') })
  $paths += @(Get-ChildItem -LiteralPath (Join-Path $taskRoot 'assets') -File)
  foreach ($file in $paths) {
    $relative = [IO.Path]::GetRelativePath($taskRoot,$file.FullName).Replace('\','/')
    $files += @{file=$relative;data=[Convert]::ToBase64String([IO.File]::ReadAllBytes($file.FullName));encoding='base64'}
  }
  $body = @{name=$projectName;project=$project.projectId;target='production';files=$files;projectSettings=@{framework=$null;buildCommand='';outputDirectory='.'};meta=@{githubCommitOrg='Dayspringcentre';githubCommitRepo='dayspring-centre-england';githubCommitRef='main'}} | ConvertTo-Json -Depth 10 -Compress
  $deployment = Invoke-RestMethod 'https://api.vercel.com/v13/deployments' -Method Post -Headers $headers -ContentType 'application/json' -Body $body
  @{id=$deployment.id;url=$deployment.url;state=$deployment.readyState;alias=$deployment.alias} | ConvertTo-Json | Set-Content (Join-Path $PSScriptRoot 'deployment-result.json')
  @{id=$deployment.id;url=$deployment.url;state=$deployment.readyState;alias=$deployment.alias} | ConvertTo-Json
}
else {
  $saved = Get-Content (Join-Path $PSScriptRoot 'deployment-result.json') -Raw | ConvertFrom-Json
  $deployment = Invoke-RestMethod ('https://api.vercel.com/v13/deployments/'+$saved.id) -Headers $headers
  @{id=$deployment.id;url=$deployment.url;state=$deployment.readyState;alias=$deployment.alias;errorMessage=$deployment.errorMessage} | ConvertTo-Json
}
