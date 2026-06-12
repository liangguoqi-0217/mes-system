[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$token = "YOUR_GITHUB_TOKEN_HERE"
$owner = "liangguoqi-0217"
$repo = "device-management-system"
$baseDir = "D:\CodeBuddy CN\设备管理系统\web-demo"
$headers = @{
    Authorization = "Bearer $token"
    Accept = "application/vnd.github+json"
}

$allFiles = Get-ChildItem -Path $baseDir -Recurse -File | Where-Object { $_.Name -ne "upload.ps1" }
$total = $allFiles.Count
$success = 0

foreach ($file in $allFiles) {
    $relPath = $file.FullName.Replace($baseDir + "\", "").Replace("\", "/")
    $rawContent = [System.IO.File]::ReadAllBytes($file.FullName)
    $b64 = [System.Convert]::ToBase64String($rawContent)
    
    $body = @{
        message = "Add $relPath"
        content = $b64
    } | ConvertTo-Json -Depth 1

    $url = "https://api.github.com/repos/$owner/$repo/contents/$relPath"
    try {
        $null = Invoke-RestMethod -Uri $url -Method Put -Headers $headers -Body $body -ContentType "application/json"
        $success++
        Write-Output "OK [$success/$total] $relPath"
    } catch {
        Write-Output "FAIL: $relPath -- $($_.Exception.Message)"
    }
}
Write-Output "Done! Uploaded $success / $total files"
