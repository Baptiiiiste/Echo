# Echo

![License](https://img.shields.io/badge/License%20Echo-Polyform%20Noncommercial%201.0.0-lightgrey)
![License](https://img.shields.io/badge/License%20Shipfree-MIT-lightgrey)

> [!NOTE]  
> This project is based on [ShipFree](https://github.com/revokslab/ShipFree), which is licensed under the MIT License.
>
>All modifications and additional original code written by Baptiste (2025) are licensed under the PolyForm Noncommercial License 1.0.0.
>
>MIT license applies exclusively to the original ShipFree code.\
>PolyForm Noncommercial License 1.0.0 applies exclusively to my added code.

## Docker

The Docker files are organized as follows:

```
docker
├── dev
│   ├── Dockerfile                  # Dockerfile for development
│   └── docker-compose.yml          # Development setup with PostgreSQL
└── prod
    ├── Dockerfile                  # Dockerfile for production
    └── docker-compose.yml          # Production setup with PostgreSQL
```

### Development Environment
```bash
docker-compose -f docker/dev/docker-compose.yml up --build
```

### Production Environment
```bash
docker-compose -f docker/prod/docker-compose.yml up --build
```

### Portainer Integration

Portainer is included in both development and production setups to help you manage your Docker containers via a web interface.

- **Access Portainer**: `http://localhost:9000`
- **Default credentials**: Set up during the first login.

## ShipFree Docs

Shipfree provides several features, including:
- SEO Optimisation
- User authentication with Supabase
- Stripe and LemonSqueezy integration
- Email notifications via Mailgun
- Modern UI built with Next.js and TailwindCSS

See the [documentation](https://shipfree.idee8.agency/docs) for a full list of features.

## Contributing

See the [CONTRIBUTING](CONTRIBUTING) file for details.
See the [TODO](TODO.md) list for details.
