import {
    Navbar,
    NavbarBrand,
    NavbarText,
    Input,
    Container,
    CardImg,
    CardImgOverlay,
    CardText,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Button,
    Card,
    CardBody,
    CardTitle,CardSubtitle
  } from 'reactstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import Link from 'next/link'
  import { Search } from 'iconoir-react';
  import styles from '@/styles/Home.module.css'

export default function Login() {  
  
    return (
      <>
        <div>
          <Navbar
            fixed="top"
            container="sm"
            expand={true}
            className=""
          >
            <NavbarBrand href="/">Shoppuu</NavbarBrand>
            <NavbarText>Kênh người bán</NavbarText>
          </Navbar>
        </div>
        <main className={`${styles.main}`}>
          <Container>
            <Row>
              <Col md={8}>
                <Card inverse>
                  <CardImg
                    alt="Card image cap"
                    src="/images/login-bg.jpg"
                    width="100%"
                  />
                  <CardImgOverlay>
                    <CardTitle className="text-dafault fs-1 fw-bold" tag="h5">
                      Bán hàng chuyên nghiệp
                    </CardTitle>
                    <CardText className="text-default">
                      Quản lý shop của bạn một cách hiệu quả hơn trên Shopuu với
                      Shopuu - Kênh Người bán
                    </CardText>
                    <CardText>
                      <small className="text-muted">Quản lý shop</small>
                    </CardText>
                  </CardImgOverlay>
                </Card>
              </Col>
              <Col md={4} className="shadow p-1 bg-body rounded">
                <Card style={{ width: "100%" }}>
                  <CardBody>
                    <CardTitle tag="h5" className="text-info fw-bold">
                      Đăng nhập
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      Kênh người bán
                    </CardSubtitle>

                    <Form>
                      <FormGroup>
                        <Label for="exampleEmail" hidden>
                          Email
                        </Label>
                        <Input
                          id="exampleEmail"
                          name="email"
                          placeholder="Email"
                          type="email"
                        />
                      </FormGroup>{" "}
                      <FormGroup>
                        <Label for="examplePassword" hidden>
                          Mật khẩu
                        </Label>
                        <Input
                          id="examplePassword"
                          name="password"
                          placeholder="Mật khẩu"
                          type="password"
                        />
                      </FormGroup>{" "}
                      <Button color="danger" outline block={true}>
                        Đăng nhập
                      </Button>
                    </Form>
                    <hr></hr>
                    <CardText className="d-flex justify-content-center">
                      <small className="text-muted">
                        Bạn chưa có tài khoản bán hàng? <Link href={'/signup/shop'} className='text-danger'>Đăng ký</Link>
                      </small>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </>
    );
}