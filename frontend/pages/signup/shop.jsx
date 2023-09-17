import { useState } from 'react'
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
  import axios from 'axios'
  import { useRouter } from "next/router"

export default function Signup() {  
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handeSignUp = async () => {
      if(!name || !email || !password) return console.log('errr')
      const { data } = await axios.post('/api/shop/signup', {
        name, email, password
      })
      if(!data && data.status !== 201) return console.log('errr')
      const { tokens, shop } = data.metadata?.metadata
      if(!tokens) return console.log('errr')
      const { accessToken, refreshToken } = tokens
      window.localStorage.setItem('authorization', accessToken)
      router.replace('/login/shop')
    }
  
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
              <Col md={4}></Col>
              <Col md={4} className="shadow p-1 bg-body rounded">
                <Card style={{ width: "100%" }}>
                  <CardBody>
                    <CardTitle tag="h5" className="text-info fw-bold">
                      Đăng ký tài khoản
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      Kênh người bán
                    </CardSubtitle>

                    <Form>
                      <FormGroup>
                        <Label for="exampleName" hidden>
                          Họ Tên
                        </Label>
                        <Input
                          id="exampleName"
                          name="name"
                          placeholder="Họ tên"
                          type="text" value={name}
                          onChange={(e) => { setName(e.target.value) }}
                        />
                      </FormGroup>{" "}
                      <FormGroup>
                        <Label for="exampleEmail" hidden>
                          Email
                        </Label>
                        <Input
                          id="exampleEmail"
                          name="email"
                          placeholder="Email"
                          type="email" value={email}
                          onChange={(e) => { setEmail(e.target.value) }}
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
                          type="password" value={password}
                          onChange={(e) => { setPassword(e.target.value) }}
                        />
                      </FormGroup>{" "}
                      <Button color="danger" outline block={true} onClick={handeSignUp}>
                        Đăng ký
                      </Button>
                    </Form>
                    <hr></hr>
                    <CardText className="d-flex justify-content-center">
                      <small className="text-muted">
                        Bạn đã có tài khoản?{" "}
                        <Link href={"/signup/shop"} className="text-danger">
                          Đăng nhập
                        </Link>
                      </small>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}></Col>
            </Row>
          </Container>
        </main>
      </>
    );
}