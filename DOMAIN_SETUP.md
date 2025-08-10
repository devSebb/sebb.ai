# 🌐 Domain Setup Guide for GoDaddy + Render

## 📋 Prerequisites
- ✅ Your Rails app deployed on Render at: `https://sebb-ai.onrender.com/`
- ✅ Your GoDaddy domain: `sebb.ai`
- ✅ Access to GoDaddy DNS management

## 🔧 Step-by-Step Setup

### 1. Your Render App URL
- **Render App**: `https://sebb-ai.onrender.com/`
- **Domain**: `sebb.ai`

### 2. Configure GoDaddy DNS

#### Option A: CNAME Record (Recommended)
```
Type: CNAME
Name: @ (or leave blank for root domain)
Value: sebb-ai.onrender.com
TTL: 600 (or 1 hour)
```

#### Option B: A Record (Alternative)
```
Type: A
Name: @ (or leave blank for root domain)
Value: 76.76.19.19
TTL: 600 (or 1 hour)
```

#### For WWW Subdomain
```
Type: CNAME
Name: www
Value: sebb-ai.onrender.com
TTL: 600
```

### 3. Configuration Files (Already Updated)

#### ✅ `render.yaml` is configured for:
```yaml
customDomains:
  - name: sebb.ai
    type: apex
  - name: www.sebb.ai
    type: subdomain
```

#### ✅ `config/environments/production.rb` is configured for:
```ruby
config.hosts = [
  "sebb.ai",
  "www.sebb.ai",
  "sebb-ai.onrender.com",
  ".onrender.com"
]
```

### 4. Deploy Changes
```bash
git add .
git commit -m "Configure custom domain sebb.ai for Render deployment"
git push origin main
```

### 5. Add Domain in Render Dashboard
- Go to your Render app dashboard: `https://dashboard.render.com/web/sebb-ai`
- Click "Settings" → "Custom Domains"
- Add your domain: `sebb.ai`
- Add subdomain: `www.sebb.ai`
- Render will provide SSL certificates automatically

## ⏱️ DNS Propagation Time
- **CNAME Records**: 15 minutes to 24 hours
- **A Records**: 15 minutes to 48 hours
- **Global propagation**: Up to 72 hours

## 🔍 Testing Your Domain
1. Wait for DNS propagation
2. Test: `https://sebb.ai`
3. Test: `https://www.sebb.ai`
4. Check SSL certificate is active

## 🚨 Common Issues & Solutions

### Issue: Domain not resolving
- **Solution**: Wait longer for DNS propagation
- **Check**: Use `nslookup sebb.ai` or `dig sebb.ai`

### Issue: SSL certificate errors
- **Solution**: Wait for Render to provision SSL (usually 15-30 minutes)
- **Check**: Verify domain is added in Render dashboard

### Issue: Mixed content warnings
- **Solution**: Ensure all assets use HTTPS
- **Check**: Update any hardcoded HTTP URLs

## 📞 Support
- **GoDaddy DNS Issues**: Contact GoDaddy support
- **Render Issues**: Check Render status page or contact support
- **Rails Issues**: Check application logs in Render dashboard

## 🎯 Final Checklist
- [ ] DNS records configured in GoDaddy
- [ ] Configuration files updated with sebb.ai domain
- [ ] Changes committed and pushed to Git
- [ ] Domain added in Render dashboard
- [ ] SSL certificate provisioned
- [ ] Domain tested and working

## 🌐 Your Final URLs
- **Main Site**: `https://sebb.ai`
- **WWW Version**: `https://www.sebb.ai`
- **Render Backup**: `https://sebb-ai.onrender.com` 